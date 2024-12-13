const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const mode = argv.mode || 'development' // 기본 모드는 development

  return {
    mode,
    entry: './src/index.js', // 엔트리 파일
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/', // React Router 사용 시 필요
    },
    resolve: {
      extensions: ['.js', '.jsx'], // 확장자 생략 가능
    },
    devServer: {
      port: 3000,
      open: true,
      historyApiFallback: true, // React Router를 위한 설정
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // JS, JSX 파일 처리
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.s?css$/, // CSS 및 SCSS 파일 처리
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|ico)$/, // 이미지 파일 처리
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html', // HTML 템플릿 경로
        favicon: './public/favicon-32x32.png', // 파비콘 (선택)
      }),
    ],
  }
}
