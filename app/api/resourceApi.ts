import { baseApi } from './baseApi';

interface BaseResource {
  id?: number;
  name: string;
  status: string;
  location: string;
  cost: number;
  quality: string;
  description?: string;
  tags: string[];
  documentUrls: string[];
  notes?: string;
  availableFrom: string;
  availableTo?: string;
  riskLevel: string;
}

interface DonorResource extends BaseResource {
  donorType: string;
  birthDate: string;
  bloodType: string;
  ethnicity: string;
  education: string;
  height: number;
  weight: number;
  medicalHistory?: string;
  familyHistory?: string;
  geneticScreening?: string;
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
  personalityTraits?: string;
  specialTalents?: string;
  donationCount: number;
  successfulDonations: number;
}

interface SurrogateResource extends BaseResource {
  birthDate: string;
  bloodType: string;
  ethnicity: string;
  education: string;
  height: number;
  weight: number;
  medicalHistory?: string;
  familyHistory?: string;
  geneticScreening?: string;
  pregnancyCount: number;
  successfulPregnancies: number;
  surrogacyCount: number;
  successfulSurrogacies: number;
  pregnancyHistory?: string;
  maritalStatus: string;
  hasPartnerSupport: boolean;
  lifestyleInformation?: string;
  employmentStatus: string;
  psychologicalEvaluation?: string;
  hasInsurance: boolean;
}

interface MedicalResource extends BaseResource {
  resourceType: string;
  specialization: string;
  licenseNumber: string;
  accreditation: string;
  capacity: number;
  currentOccupancy: number;
  facilities?: string;
  equipment?: string;
  successRate: number;
  experienceYears: number;
  certifications?: string;
  hasEmergencySupport: boolean;
  insuranceInformation?: string;
  operatingHours?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

interface PostnatalResource extends BaseResource {
  resourceType: string;
  roomCount: number;
  currentOccupancy: number;
  facilities?: string;
  services?: string;
  licenseNumber: string;
  accreditation: string;
  medicalSupport?: string;
  nutritionServices?: string;
  careServices?: string;
  hasNursery: boolean;
  hasEmergencySupport: boolean;
  insuranceInformation?: string;
  operatingHours?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  roomTypes?: string;
  amenities?: string;
}

interface HumanResource extends BaseResource {
  resourceType: string;
  specialization: string;
  licenseNumber: string;
  birthDate: string;
  gender: string;
  education: string;
  qualifications?: string;
  certifications?: string;
  experienceYears: number;
  languages: string;
  expertise?: string;
  successRate: number;
  workHistory?: string;
  availability?: string;
  workingHours: string;
  contactPhone: string;
  contactEmail: string;
  performanceMetrics?: string;
  isFullTime: boolean;
}

type Resource = DonorResource | SurrogateResource | MedicalResource | PostnatalResource | HumanResource;

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

interface ResourceStats {
  availableResources: number;
  resourceGrowth: number;
  typeDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  qualityDistribution: Record<string, number>;
  riskDistribution: Record<string, number>;
}

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchResources: builder.query<
      ApiResponse<PageResponse<Resource>>,
      { type: string; search?: string; page?: number; size?: number }
    >({
      query: ({ type, search = '', page = 0, size = 10 }) =>
        `/resources/search?type=${type}&search=${search}&page=${page}&size=${size}`,
      providesTags: ['Resource'],
    }),
    getResourcesByStatus: builder.query<
      ApiResponse<PageResponse<Resource>>,
      { type: string; status: string; page?: number; size?: number }
    >({
      query: ({ type, status, page = 0, size = 10 }) =>
        `/resources/status?type=${type}&status=${status}&page=${page}&size=${size}`,
      providesTags: ['Resource'],
    }),
    getResource: builder.query<ApiResponse<Resource>, number>({
      query: (id) => `/resources/${id}`,
      providesTags: ['Resource'],
    }),
    createResource: builder.mutation<ApiResponse<Resource>, { type: string; resource: Resource }>({
      query: ({ type, resource }) => ({
        url: `/resources/${type}`,
        method: 'POST',
        body: resource,
      }),
      invalidatesTags: ['Resource'],
    }),
    updateResource: builder.mutation<ApiResponse<Resource>, { id: number; resource: Partial<Resource> }>({
      query: ({ id, resource }) => ({
        url: `/resources/${id}`,
        method: 'PUT',
        body: resource,
      }),
      invalidatesTags: ['Resource'],
    }),
    deleteResource: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resource'],
    }),
    getStatusDistribution: builder.query<ApiResponse<Record<string, number>>, string>({
      query: (type) => `/resources/stats/status?type=${type}`,
    }),
    getLocationDistribution: builder.query<ApiResponse<Record<string, number>>, string>({
      query: (type) => `/resources/stats/location?type=${type}`,
    }),
    getQualityDistribution: builder.query<ApiResponse<Record<string, number>>, string>({
      query: (type) => `/resources/stats/quality?type=${type}`,
    }),
    getRiskLevelDistribution: builder.query<ApiResponse<Record<string, number>>, string>({
      query: (type) => `/resources/stats/risk-level?type=${type}`,
    }),
    getResourceStats: builder.query<ApiResponse<ResourceStats>, void>({
      query: () => '/stats',
    }),
  }),
}); 