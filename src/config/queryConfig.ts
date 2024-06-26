const shortLivedData = {
    staleTime: 5000, // 5 seconds
    cacheTime: 60000, // 60 seconds
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000 // fixed 1 second delay
}

const mediumLivedData = {
    staleTime: 300000, // 5 minutes
    cacheTime: 1800000, // 30 minutes
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000 // fixed 1 second delay
}

const longLivedData = {
    staleTime: 86400000, // 24 hours
    cacheTime: 604800000, // 7 days
    refetchOnWindowFocus: true,
    retry: 5,
    retryDelay: 1000 // fixed 1 second delay
}

const infiniteLivedData = {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: true,
    retry: 5,
    retryDelay: 1000 // fixed 1 second delay
}

export const queryConfig = {
    shortLivedData,
    mediumLivedData,
    longLivedData,
    infiniteLivedData
}