import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedData,
} from '../types/types';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | PaginatedApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const message = response.statusMessage || 'Success';

    return next.handle().pipe(
      map((data) => {
        // Check if the response follows the PaginatedData interface structure
        if (this.isPaginatedData(data)) {
          const { items, total, page, perPage, totalPages } = data;
          return {
            meta: {
              statusCode: response.statusCode,
              message,
              timestamp: new Date().toISOString(),
              path: request.url,
              pagination: {
                total,
                page,
                perPage,
                totalPages,
              },
            },
            data: items,
          };
        }

        // Regular response
        return {
          meta: {
            statusCode: response.statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
          data,
        };
      }),
    );
  }

  private isPaginatedData(data: any): data is PaginatedData<T> {
    return (
      data &&
      Array.isArray(data.items) &&
      typeof data.total === 'number' &&
      typeof data.page === 'number' &&
      typeof data.perPage === 'number' &&
      typeof data.totalPages === 'number'
    );
  }
}
