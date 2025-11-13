import { useEffect } from "react";

interface AnyCommentWidgetProps {
  appId: number;
  language?: string;
  pageId?: string;
  pageTitle?: string;
}

declare global {
  interface Window {
    AnyComment: any;
  }
}

export function AnyCommentWidget({ appId, language = "ru", pageId, pageTitle }: AnyCommentWidgetProps) {
  useEffect(() => {
    const existingScript = document.getElementById('anycomment-script');
    if (existingScript) {
      existingScript.remove();
    }

    window.AnyComment = window.AnyComment || [];
    window.AnyComment.Comments = [];
    window.AnyComment.Comments.push({
      root: "anycomment-app",
      app_id: appId,
      language: language,
      page_id: pageId,
      page_title: pageTitle
    });

    const script = document.createElement("script");
    script.id = 'anycomment-script';
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://widget.anycomment.io/comment/embed.js";
    
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript.nextSibling);
    }

    return () => {
      const scriptToRemove = document.getElementById('anycomment-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      
      const container = document.getElementById('anycomment-app');
      if (container) {
        container.innerHTML = '';
      }
      
      if (window.AnyComment) {
        delete window.AnyComment;
      }
    };
  }, [appId, language, pageId, pageTitle]);

  if (!appId) {
    return (
      <div className="border rounded-md p-6 text-center" data-testid="anycomment-placeholder">
        <p className="text-muted-foreground">
          Загрузка комментариев...
        </p>
      </div>
    );
  }

  return <div id="anycomment-app" data-testid="anycomment-widget"></div>;
}
