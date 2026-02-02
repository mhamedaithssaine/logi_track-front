export interface CarrierResponseDto {
  id: number;
  code: string;
  name: string;
  active: boolean;
}

export interface CarrierCreateDto {
  code: string;
  name: string;
  active?: boolean;
}

export interface CarrierUpdateDto {
  name: string;
  active?: boolean;
}
