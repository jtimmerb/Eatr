export default class RepoController<Repo> {
  private repo: Repo;

  constructor(repo: Repo) {
    this.repo = repo;
  }

  public getRepo() {
    return this.repo;
  }
}
