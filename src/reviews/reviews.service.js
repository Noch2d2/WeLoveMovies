const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const tableName = "reviews";

//I was going to use this, but changed my mind.  I'll leave it here for my own review later.
const reduceReviews = (data) => reduceProperties("review_id",{
  preferred_name: ["critic", null, "preferred_name"],
  surname : ["critic", null, "surname"],
  organization_name : ["critic", null, "organization_name"]
})(data).map((review)=> (
  {
    ...review,
    critic:review.critic[0]
  })
);

const buildReviewsList = (reviews)=>{
  return reviews.map((review)=> {
    return {
      review_id: review.review_id,
      content: review.content,
      score: review.score,
      movie_id: review.movie_id,
      created_at: review.created_at,
      updated_at: review.updated_at,
      critic:{
        preferred_name: review.preferred_name,
        surname: review.surname,
        organization_name: review.organization_name
      }
    }
  });
};

async function destroy(reviewId) {
  return db("reviews")
    .where("review_id", reviewId).del()
}

async function list(movie_id) {
  return db("reviews")
    .join("critics",
      "critics.critic_id",
      "reviews.critic_id")
    .where ({ "reviews.movie_id": movie_id })
    .then(buildReviewsList);
}

async function read(reviewId) {
  const data = db("reviews").where("review_id",reviewId).first();
  return data;
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
