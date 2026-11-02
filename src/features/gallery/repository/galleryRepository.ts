import { publicClient } from '@/core/api/publicClient';
import { PicsumEndpoints } from '@/core/api/endpoints';
import { PicsumImage } from '../models/gallery.types';

export const galleryRepository = {
  getImages: async (page = 1, limit = 20) =>
    (await publicClient.get<PicsumImage[]>(PicsumEndpoints.list, { params: { page, limit } })).data,
};