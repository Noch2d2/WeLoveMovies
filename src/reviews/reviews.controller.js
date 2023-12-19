const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const {reviewId} = request.params;
  const review = await service.read(parseInt(reviewId));
  if(review) {
    response.locals.review = review;
    return next();
  }
  next({status: 404, message : `Review cannot be found found`});

}

async function destroy(request, response) {
  await service.destroy(response.locals.review.review_id);
  response.sendStatus(204);
}

async function list(request, response) {
  const dbResponse = await service.list(request.params.movieId);
  response.json({data: dbResponse });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response, next) {
  const {review} = response.locals;
  if (response.locals.review.review_id){
    const dbResponse = await service.update({
      ...review,
      ...request.body.data,
      review_id: review.review_id
    });
    response.json({data:dbResponse});
  }
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};