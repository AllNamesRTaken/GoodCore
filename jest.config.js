
export default {
    coverageDirectory: 'coverage',
    // globals: {
    //     'ts-jest': {
    //         tsconfig: 'tsconfig.test.json',
    //         diagnostics: true,
    //     },
    // },
    transform: {
        '\\.ts$': [
            'ts-jest', {
                tsconfig: 'tsconfig.test.json',
                diagnostics: true,
            }
        ]
    },
    testEnvironment: "node",
    testEnvironmentOptions: {
        url: "http://domain.com/index.html"
    },
    moduleFileExtensions: [
        'js',
        'ts',
        'tsx',
    ],
    preset: 'ts-jest',
    testMatch: [
        '**/src/__tests__/*Test.+(ts|tsx|js)',
    ],
    testTimeout: 25000,
    resolver: 'jest-ts-webcompat-resolver',
}