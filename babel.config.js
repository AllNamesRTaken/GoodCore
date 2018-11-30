module.exports = function (api) {
    api.cache(true)
    
    const presets = [
        [
            "@babel/preset-env",
            {
                targets: "> 0.25%, not dead",
                forceAllTransforms: true,
            }
        ]
    ];
    return {
        presets,
        //plugins: ["@babel/plugin-transform-reserved-words", "@babel/plugin-transform-property-literals", "@babel/plugin-transform-member-expression-literals", "@babel/plugin-transform-property-mutators"]
    };
}