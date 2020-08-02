import { Children, ReactElement } from 'react';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { appLanguage, GA_TRACKING_ID, isProduction, theme } from '@zoonk/utils';

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

          {this.props.styleTags}

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </Head>
        <body
          style={{
            margin: 0,
            padding: 0,
            background: theme.palette.background.default,
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
