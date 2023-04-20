import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { TodosService } from 'src/app/todos/services/todos.service';
import { TodosComponent } from '../todos.component';
import { FormsModule } from '@angular/forms';


describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let todosServiceStub: Partial<TodosService>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(() => {
    todosServiceStub = {
      getTodos: jasmine.createSpy('getTodos'),
      addTodo: jasmine.createSpy('addTodo'),
      deleteTodo: jasmine.createSpy('deleteTodo'),
      updateTodoTitle: jasmine.createSpy('updateTodoTitle')
    };
    authServiceStub = {
      logout: jasmine.createSpy('logout')
    };
    TestBed.configureTestingModule({
      declarations: [TodosComponent],
      providers: [
        { provide: TodosService, useValue: todosServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ],
      imports: [FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });

  it('call getTodos on init', () => {
    expect(todosServiceStub.getTodos).toHaveBeenCalled();
  });

  it('call add todo', () => {
    component.todoTitle = 'New Todo';
    component.addTodoHandler();
    expect(todosServiceStub.addTodo).toHaveBeenCalledWith('New Todo');
    expect(component.todoTitle).toEqual('');
  });

  it('call delete todo', () => {
    component.deleteTodo('123');
    expect(todosServiceStub.deleteTodo).toHaveBeenCalledWith('123');
  });

  it('call update todo title', () => {
    component.editTodo({ todoId: '123', title: 'New Title' });
    expect(todosServiceStub.updateTodoTitle).toHaveBeenCalledWith('123', 'New Title');
  });

  it('call logout', () => {
    component.logoutHandler();
    expect(authServiceStub.logout).toHaveBeenCalled();
  });
});
