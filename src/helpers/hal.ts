export interface Link {
  href: string
  [key: string]: string
}

export interface Links {
  self: Link
  [key: string]: Link
}

type LinkMetadata = { [k: string]: string };

export class LinkBuilder {

  private readonly links: Links;

  constructor(href: string, metadata?: LinkMetadata) {
    let self: Link = { href };

    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        self[key] = value;
      }
    }

    this.links = { self };
  }

  add(name: string, href: string, metadata?: LinkMetadata): LinkBuilder {
    this.links[name] = { href };

    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        this.links[name][key] = value;
      }
    }

    return this;
  }

  build(): Links {
    return this.links;
  }

}
