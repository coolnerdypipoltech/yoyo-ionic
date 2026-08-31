// Shapes confirmed against the yoyo-admin Laravel backend (see YoYo-API-Reference.md).
// Dead/unused legacy models from the old Unity client (Reward.cs, Code.cs,
// SocialMedia.cs, Transaction.cs) are intentionally NOT ported here.

export interface MediaRef {
  id: number;
  type: string;
  context: string | null;
  url: string | null;
  related_id: number;
  related_type: string;
  absolute_url: string;
}

export type Gallery = MediaRef;
export type Medium = MediaRef;
export type Thumbnail = MediaRef;

export interface UserProfile {
  id: number;
  age: number | null;
  gender: string | null;
  phone: string | null;
  points: number;
  total_points: number;
  pronouns: string | null;
  access_code_id: number | null;
  taste_drink: string | null;
  taste_music: string | null;
  taste_food: string | null;
  image: Gallery | null;
  media: Medium | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  related_id: number;
  related_type: string;
  created_at: string;
  updated_at: string;
  related: UserProfile;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface Place {
  id: number;
  name: string;
  description: string;
  url: string | null;
  schedule: string | null;
  music_genre: string | null;
  music_lineup: string | null;
  dresscode: string | null;
  payment_options: string | null;
  address: string | null;
  gmaps: string | null;
  website_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  cost_rate: string | null;
  created_at: string;
  updated_at: string;
  music_genre_list: string[];
  payment_options_list: string[];
  schedule_list: string[];
  media: MediaRef[];
  gallery: Gallery[];
  thumbnail: Thumbnail | null;
}

export interface ResultObject {
  id: number;
  name: string;
  description: string;
  url: string | null;
  conditions: string | null;
  starts_on: string | null;
  ends_on: string | null;
  cost: number;
  stock: number;
  created_at: string;
  updated_at: string;
  thumbnail: Thumbnail | null;
  gallery: Gallery[];
  media: Medium[];
}

export interface AdResult {
  id: number;
  order: number;
  url: string | null;
  created_at: string;
  updated_at: string;
  main: MediaRef;
  media: MediaRef[];
}

export interface AdvertisementResponse {
  results: AdResult[];
}

// Normalized pagination shape used throughout the app — the API client
// layer maps `PlacesResponse.prev` and `Root.previous` onto this same
// shape so calling code never has to know about the naming inconsistency.
export interface Paginated<T> {
  results: T[];
  total: number;
  next: string | null;
  previous: string | null;
}

export interface SignUpRequest {
  name: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  password: string;
  points: number;
  pronouns: string;
  access_code: string;
}

export interface UpdateTastesRequest {
  age: number | null;
  gender: string | null;
  pronouns: string | null;
  taste_drink: string;
  taste_music: string;
  taste_food: string;
}
