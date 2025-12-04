import ApiService from './apiService';

export interface RepairRequest {
  category: string;
  description: string;
  photoUri?: string;
}

export interface RepairResponse {
  _id: string;
  resident: string;
  building: string;
  apartment: string;
  description: string;
  category: string;
  status: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

class RepairService {
  private static instance: RepairService;

  public static getInstance(): RepairService {
    if (!RepairService.instance) {
      RepairService.instance = new RepairService();
    }
    return RepairService.instance;
  }

  async createRepairRequest(data: RepairRequest): Promise<RepairResponse> {
    const formData = new FormData();

    // Add text fields
    formData.append('category', data.category);
    formData.append('description', data.description);

    // Add photo if provided
    if (data.photoUri) {
      // For React Native, append the image URI with proper structure
      const filename = `repair-photo-${Date.now()}.jpg`;
      formData.append('photo', {
        uri: data.photoUri,
        type: 'image/jpeg',
        name: filename,
      } as any);
    }

    const response = await ApiService.post<RepairResponse>('/api/repairs', formData);
    return response.data;
  }

  async getUserRepairs(): Promise<RepairResponse[]> {
    const response = await ApiService.get<RepairResponse[]>('/api/repairs');
    return response.data;
  }

  async updateRepairStatus(repairId: string, status: string): Promise<RepairResponse> {
    const response = await ApiService.put<RepairResponse>(`/api/repairs/${repairId}`, { status });
    return response.data;
  }
}

export default RepairService.getInstance();
