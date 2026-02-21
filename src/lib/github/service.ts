export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  private: boolean;
  fork: boolean;
}

export async function fetchGithubRepos(
  username: string,
  token: string,
): Promise<GithubRepo[]> {
  const allRepos: GithubRepo[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 0 },
      },
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const repos: GithubRepo[] = await res.json();
    if (repos.length === 0) break;

    allRepos.push(...repos.filter((r) => !r.private && !r.fork));
    page++;
    if (repos.length < 100) break;
  }

  return allRepos;
}

export async function fetchRepoReadme(
  fullName: string,
  token: string,
): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.raw",
      },
    });

    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
