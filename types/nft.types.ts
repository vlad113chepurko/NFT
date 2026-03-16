export type NFT = {
  id: number;
  name: string;
  image_url: string;
  price: number;
  traits: {
    Hat: string | null;
    Skin: string | null;
    Kimono: string | null;
    Background: string | null;
    Body: string | null;
  };
};

export type CartItem = NFT & { qty: number };
