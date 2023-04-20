import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodosService } from './todos.service';
import { DomainTodo, Todo } from 'src/app/todos/models/todos.models';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';

describe('TodosService', () => {
  let service: TodosService;
  let httpMock: HttpTestingController;

  const mockTodos: Todo[] = [
    { id: '1', title: 'Mock Todo 1', order: 1, addedDate: 'now' },
    { id: '2', title: 'Mock Todo 2', order: 1, addedDate: 'now' },
    { id: '3', title: 'Mock Todo 3', order: 1, addedDate: 'now' }
  ];
  const expectedTodos: DomainTodo[] = mockTodos.map((todo) => ({ ...todo, filter: 'all' }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService],
    });
    service = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('created', () => {
    expect(service).toBeTruthy();
  });

  it('get todos from api', () => {
    service.getTodos();
    const req = httpMock.expectOne(`${environment.baseUrl}/todo-lists`);
    req.flush(mockTodos);

    expect(req.request.method).toEqual('GET');
    expect(service.todos$.getValue()).toEqual(expectedTodos);
  });

  it('delete todo', () => {
    service.todos$.next(expectedTodos)
    service.deleteTodo('2');
    const req = httpMock.expectOne(`${environment.baseUrl}/todo-lists/2`);
    req.flush({});

    expect(req.request.method).toBe('DELETE');
    expect(service.todos$.getValue()).toEqual(expectedTodos.filter(todo => todo.id !== '2'));
  });

  it('add todo', () => {
    const newMockTodo: DomainTodo = { id: '4', title: 'New Todo', order: 1, addedDate: 'now', filter: 'all' };
    service.todos$.next(expectedTodos)
    service.addTodo('New Todo');
    const req = httpMock.expectOne(`${environment.baseUrl}/todo-lists`);
    req.flush({ data: { item: newMockTodo } });

    expect(req.request.method).toBe('POST');
    expect(service.todos$.getValue()).toContain(newMockTodo);
  });

  it('change todo filter', () => {
    service.todos$.next(expectedTodos)
    const todoId = '1';
    const filter = 'active';
    service.changeFilter(todoId, filter);

    expect(service.todos$.getValue().find(todo => todo.id === todoId)?.filter).toEqual(filter);
  });
});
