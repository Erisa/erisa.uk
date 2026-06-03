export default function FooterLink(
  { url, href, children, content, target, rel },
) {
  const isActive = url === href ||
    (href === "/" && url === "/index.html") ||
    (href !== "/" && url?.startsWith(href.replace(/\/$/, "")));

  if (isActive) {
    return <>{children || content}</>;
  }

  return (
    <a href={href} target={target} rel={rel}>
      {children || content}
    </a>
  );
}
