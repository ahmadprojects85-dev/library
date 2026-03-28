export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  pages: number;
  year: number;
  featured?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email?: string;
  phone: string;
  city: string;
  address: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  date: string;
}
