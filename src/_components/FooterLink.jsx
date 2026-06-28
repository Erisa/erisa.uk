const normalize = (path) => path.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";

export default function FooterLink(
  { url, href, children, content, target, rel },
) {
  const isActive = normalize(url) === normalize(href);

  if (isActive) {
    return <>{children || content}</>;
  }

  return (
    <a href={href} target={target} rel={rel}>
      {children || content}
    </a>
  );
}
