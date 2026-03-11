import { CallHandler, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { NoteRdo } from '../rdo/note.rdo';

export class NoteRdoInterceptor implements NestInterceptor {
  private _executeTransform(note: Note) {
    const { id, title, content, created_at, user, views } = note.get();

    return {
      id,
      title,
      content,
      created_at,
      views,
      author: user.get().name,
    };
  }

  intercept(
    _: any,
    next: CallHandler<any>,
  ): Observable<NoteRdo> | Promise<Observable<NoteRdo>> {
    return next.handle().pipe(
      map<Note | Note[], any>((data) => {
        if (Array.isArray(data)) {
          return data.map((note) => this._executeTransform(note));
        }

        return this._executeTransform(data);
      }),
    );
  }
}
