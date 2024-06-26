const formatEnum = (value: string): string => {
    return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

export default formatEnum;