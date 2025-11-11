export class Subscriber {
  constructor(
    public id: string,
    public email: string,
    public displayName: string | null,
    public createdAt: Date
  ) {}
}