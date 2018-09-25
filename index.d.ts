export class Up {
  public static Code: 3;
  public static Heading: 6;
  public static Link: 1;
  public static Newline: 0;
  public static Quote: 2;
  public static Spoiler: 5;
  public static Url: 4;

  constructor(domain: string);

  public mark(
    input: string
  ): Array<
    | INode<
        typeof Up.Code,
        Array<INode<typeof Up.Url, [string]> | typeof Up.Newline | string>
      >
    | INode<typeof Up.Heading | typeof Up.Url, [string]>
    | INode<typeof Up.Link, [string, string, string]>
    | INode<
        typeof Up.Quote,
        Array<
          | INode<
              typeof Up.Spoiler,
              Array<
                | INode<typeof Up.Link, [string, string, string]>
                | INode<typeof Up.Url, [string]>
                | string
              >
            >
          | INode<typeof Up.Link, [string, string, string]>
          | INode<typeof Up.Url, [string]>
          | string
        >
      >
    | INode<
        typeof Up.Spoiler,
        Array<
          | INode<typeof Up.Link, [string, string, string]>
          | INode<
              typeof Up.Quote,
              Array<
                | INode<typeof Up.Link, [string, string, string]>
                | INode<typeof Up.Url, [string]>
                | string
              >
            >
          | INode<typeof Up.Url, [string]>
          | typeof Up.Newline
          | string
        >
      >
    | typeof Up.Newline
    | string
  >;
}

interface INode<T, TChildren> {
  children: TChildren;
  type: T;
}
