module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/preset-react'
    ],
    plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime'],
    env: {
        production: {
            plugins: ['transform-react-remove-prop-types']
        }
    }
};
