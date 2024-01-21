function shortId (name: string): string {
    return name.replace(/projects\/[^\/]+\/(topics|subscriptions)\//i, '');
}

export { shortId };
