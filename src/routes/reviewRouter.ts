import express from "express";
import { Review as Reviews} from "../other_services/model/seqModel";
import logger from "../other_services/winstonLogger";
import { fetchDataFromQueue } from "../other_services/rabbitMQ";

const router = express.Router();

router.get("/reviews/:max", async (req, res) => {
    try {

        
        const max = parseInt(req.params.max, 10);

        console.log("Params:", max);

        const reviews = await getRangeOfReviews(max);
       
        res.status(200).json(reviews); // Send enriched reviews to the client
    } catch (error) {
        console.error("Error fetching specific reviews:", error);
        res.status(500).send("Something went wrong while fetching specific reviews");
    }
});

export async function getRangeOfReviews(max: number) {
    try {
        const reviews = await Reviews.findAll({
            where: { isBlocked: 0 }, // Use 0 instead of false
            limit: 10
        });

        console.log("Reviews fetched from database:", reviews);

        if (reviews.length === 0) {
            console.log("No reviews found in the database.");
            return [];
        }

        const enrichedReviews = await Promise.all(
            reviews.map(async (review) => {
                const [user, media, genres] = await Promise.all([
                    fetchDataFromQueue("user-service", { userId: review.user_fk }),
                    fetchDataFromQueue("media-service", { mediaId: review.media_fk }),
                    fetchDataFromQueue("genre-service", { reviewId: review.id }),
                ]);

                return {
                    id: review.id,
                    title: review.title,
                    description: review.description,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    user: user || { error: "User not found" },
                    media: media || { error: "Media not found" },
                    genres: genres || [],
                };
            })
        );

        return enrichedReviews;
    } catch (error) {
        console.error("Error fetching specific reviews:", error);
        throw error;
    }
}


export default router;
