export default async function DomainList() {
  const domains = await Deno.readTextFile("src/static/domains.txt");

  return <p id="domains">{domains}</p>;
}
