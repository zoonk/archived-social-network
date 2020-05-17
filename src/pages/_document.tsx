import { Children, ReactElement } from 'react';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { appLanguage, isProduction, theme } from '@zoonk/utils';

interface CustomDocumentProps {
  styleTags: ReactElement<{}>[];
}

class CustomDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        ...Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }

  render() {
    return (
      <Html lang={appLanguage}>
        <Head>
          <meta charSet="utf-8" />

          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
            rel="stylesheet"
            type="text/css"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;400;700&display=swap"
            rel="stylesheet"
          />

          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icon-192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="/icon-512.png"
          />
          <meta name="msapplication-TileImage" content="/icon-512.png" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />

          <meta
            name="robots"
            content={isProduction ? 'index, follow' : 'noindex, nofollow'}
          />

          <style>
            {`
              * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
              }
              
              ::selection {
                background-color: ${theme.palette.secondary.main};
                color: ${theme.palette.secondary.contrastText};
              }

              ul, ol {
                padding: ${theme.spacing(1, 4)};
              }

              pre {
                background-color: black;
                color: white;
                font-size: ${theme.typography.fontSize}px;
                padding: ${theme.spacing(2, 2)};
                margin: ${theme.spacing(2, 0)};
                overflow: auto;
              } 
            `}
          </style>

          {this.props.styleTags}
        </Head>
        <body
          style={{
            margin: 0,
            padding: 0,
            background: theme.palette.background.default,
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.fontWeightRegular,
          }}
        >
          <Main />
          <NextScript />

          <noscript>
            Please, enable Javascript in your browser to use this app.
          </noscript>
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
