const invalidRequest = JSON.stringify({
    message: "Request is invalid",
});

const serverError = JSON.stringify({
    message: "Oops! Unexpected server error",
});

export default {
    invalidRequest,
    serverError,
};
