import { isValidObjectId } from 'mongoose';
import { InvalidSearchParamsExeption } from '../../exceptions/invalid-search-params';

interface searchParams {
  id: string;
}

export const validateSearchParams = (paramns: searchParams) => {
  if (!isValidObjectId(paramns.id)) {
    throw new InvalidSearchParamsExeption('ID inválido');
  }
};
