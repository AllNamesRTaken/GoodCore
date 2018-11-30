module.exports = function (api) {
    api.cache(true)
    
    return {
        plugins: ["@babel/plugin-transform-reserved-words", "@babel/plugin-transform-property-literals", "@babel/plugin-transform-member-expression-literals", "@babel/plugin-transform-property-mutators"]
    };
}