import express from "express";
import { Review as Reviews} from "../other_services/model/seqModel";
import logger from "../other_services/winstonLogger";
import { fetchDataFromQueue } from "../other_services/rabbitMQ";

const router = express.Router();

// Route to fetch reviews
router.get("/reviews/:max", async (req, res) => {
    try {
        console.log("Response from rabbitMQ: ", req.params.max);
        console.log("RabbotMQ user-service: ", fetchDataFromQueue("user-service", { userId: req.params.max }));
        console.log("RabbotMQ media-service: ", fetchDataFromQueue("media-service", { mediaId: req.params.max }));
        console.log("RabbotMQ genre-service: ", fetchDataFromQueue("genre-service", { reviewId: req.params.max }));
        const max = parseInt(req.params.max);
        const reviews = await getRangeOfReviews(max); // Use the updated function
        console.log("Specific reviews fetched successfully");
        res.status(200).send(reviews); // Send enriched reviews to the client
    } catch (error) {
        console.error("Error fetching specific reviews:", error);
        res.status(500).send("Something went wrong while fetching specific reviews");
    }
});


export async function getRangeOfReviews(max: number) {
    try {
        // Step 1: Fetch review data from Database 2
        const reviews = await Reviews.findAll({
            where: {
                isBlocked: false,
            },
            limit: max,
        });

        // Step 2: Enrich each review with data from user-service, media-service, and genre-service
        const enrichedReviews = await Promise.all(
            reviews.map(async (review) => {
                // Fetch related data using RabbitMQ
                const [user, media, genres] = await Promise.all([
                    fetchDataFromQueue("user-service", { userId: review.user_fk }), // Fetch user data
                    fetchDataFromQueue("media-service", { mediaId: review.media_fk }), // Fetch media data
                    fetchDataFromQueue("genre-service", { reviewId: review.id }), // Fetch genres
                ]);

                console.log("##### ###### \nData from rabbitMQ: \nUser: ", user, "\nMedia: ",media, "\nGenres: ", genres);

                // Combine all data into a single object
                return {
                    id: review.id,
                    title: review.title,
                    description: review.description,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    user, // User details from user-service
                    media, // Media details from media-service
                    genres, // Genres from genre-service
                };
            })
        );

        return enrichedReviews; // Return the fully enriched reviews
    } catch (error) {
        logger.error("Error fetching specific reviews: ", error);
        throw error;
    }
}



export default router;
