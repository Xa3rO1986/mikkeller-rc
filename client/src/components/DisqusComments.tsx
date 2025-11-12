import { useEffect } from 'react';

interface DisqusCommentsProps {
  shortname?: string;
  identifier: string;
  title: string;
  url: string;
}

export function DisqusComments({ shortname, identifier, title, url }: DisqusCommentsProps) {
  useEffect(() => {
    if (!shortname) {
      return;
    }

    const disqusScript = document.getElementById('disqus-script');
    if (disqusScript) {
      disqusScript.remove();
    }

    (window as any).disqus_config = function () {
      this.page.url = url;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    const script = document.createElement('script');
    script.id = 'disqus-script';
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', String(Date.now()));
    document.body.appendChild(script);

    return () => {
      const disqusScript = document.getElementById('disqus-script');
      if (disqusScript) {
        disqusScript.remove();
      }
      
      const disqusContainer = document.getElementById('disqus_thread');
      if (disqusContainer) {
        disqusContainer.innerHTML = '';
      }
      
      delete (window as any).DISQUS;
      delete (window as any).disqus_config;
    };
  }, [shortname, identifier, title, url]);

  if (!shortname) {
    return (
      <div className="border rounded-md p-6 text-center" data-testid="disqus-placeholder">
        <p className="text-muted-foreground">
          Комментарии будут доступны после настройки Disqus.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Чтобы включить комментарии, добавьте VITE_DISQUS_SHORTNAME в переменные окружения.
        </p>
      </div>
    );
  }

  return <div id="disqus_thread" data-testid="disqus-thread"></div>;
}
