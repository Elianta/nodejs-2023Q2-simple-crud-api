const invalidRequest = JSON.stringify({
    message: "Request is invalid",
});

const invalidUserId = JSON.stringify({
    message: "User ID is invalid",
});

const resourseNotFound = JSON.stringify({
    message: `Requested resource doesn\'t exist`,
});

const serverError = JSON.stringify({
    message: "Oops! Unexpected server error",
});

const userNotFound = JSON.stringify({
    message: "The requested user is not found",
});

export default {
    invalidRequest,
    resourseNotFound,
    invalidUserId,
    userNotFound,
    serverError,
};
