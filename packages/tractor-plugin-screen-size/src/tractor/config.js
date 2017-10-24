export function config (tractorConfig) {
    tractorConfig.screenSizes = tractorConfig.screenSizes || {};
    let { screenSizes } = tractorConfig;
    return screenSizes;
}
