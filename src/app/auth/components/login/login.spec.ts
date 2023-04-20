import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });

  it('set email as required', () => {
    const email = component.loginForm.controls.email;
    email.setValue('');
    expect(email.valid).toBeFalse();
    expect(email.errors?.required).toBeTruthy();
  });

  it('set email validator', () => {
    const email = component.loginForm.controls.email;
    email.setValue('notavalidemail');
    expect(email.valid).toBeFalse();
    expect(email.errors?.pattern).toBeTruthy();
  });

  it('set password as required', () => {
    const password = component.loginForm.controls.password;
    password.setValue('');
    expect(password.valid).toBeFalse();
    expect(password.errors?.required).toBeTruthy();
  });

  it('set password minlength validator', () => {
    const password = component.loginForm.controls.password;
    password.setValue('aa');
    expect(password.valid).toBeFalse();
    expect(password.errors?.minlength).toBeTruthy();
  });

  it('call authService.login on submit', () => {
    const email = component.loginForm.controls.email;
    const password = component.loginForm.controls.password;
    const rememberMe = component.loginForm.controls.rememberMe;

    password.setValue('testpassword');
    email.setValue('test@test.com');
    rememberMe.setValue(true);

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    button.click();
    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'testpassword', rememberMe: true });
  });
});
