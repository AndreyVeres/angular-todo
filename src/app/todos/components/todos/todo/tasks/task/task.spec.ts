import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { Task } from 'src/app/todos/models/tasks.models';
import { TaskStatusEnum } from 'src/app/core/enums/taskStatus.enum';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let deleteTaskSpy: jasmine.Spy;
  let changeTaskSpy: jasmine.Spy;

  const task: Task = {
    id: '1',
    todoListId: '1',
    order: 1,
    addedDate: 'now',
    title: 'task',
    description: 'descr',
    completed: false,
    status: TaskStatusEnum.active,
    priority: 2,
    startDate: '11',
    deadline: '12'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    component.task = task;
    deleteTaskSpy = spyOn(component.deleteTaskEvent, 'emit');
    changeTaskSpy = spyOn(component.changeTaskEvent, 'emit');
    fixture.detectChanges();
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });

  it('delete task', () => {
    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    deleteButton.click();
    expect(deleteTaskSpy).toHaveBeenCalledWith(task.id);
  });

  it('set editMode to true if task dbclicked', () => {
    const inputElement = fixture.nativeElement.querySelector('.task-input');
    inputElement.dispatchEvent(new MouseEvent('dblclick'));

    expect(component.editMode).toBeTrue();
  });

});
