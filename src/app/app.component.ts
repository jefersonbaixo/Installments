import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Bill } from 'src/classes/Bill';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'installments';
  form: FormGroup;

  constructor(private fb: FormBuilder, private alert: MatSnackBar){
    
  }

  ngOnInit(){
    this.createForm(new Bill());
  }

  onSubmit(obj: Bill){
    this.alert.open('Você pode ver o resultado no console!', 'Ok', {
      duration: 3000
    })
    console.log(obj);
  }

  createForm(bill: Bill){
    this.form = this.fb.group({
      value: [bill.value, Validators.required],
      numberOfInstallments: [bill.numberOfInstallments, Validators.required],
      launchDate: [bill.launchDate, Validators.required],
      installments: this.fb.array([])
    })
  }

  get installments(): FormArray {
    return this.form.get('installments') as FormArray;
  }

  isFormValid(){
    if(!this.form.valid){
      this.alert.open('Preencha todos os campos corretamente!', 'Ok', {
        duration: 3000
      })
      return false;
    }
    return true;
  }

  createInstallments(){
    if(!this.isFormValid())
      return null;
    const { numberOfInstallments, launchDate, value } = this.form.value;
    const lastValue = value - parseFloat((value / numberOfInstallments).toFixed(2)) * (numberOfInstallments -1);
    this.installments.clear();

    for (let i = 1; i <= numberOfInstallments; i++) {
      this.installments.push(
        this.fb.group({
          value: (value / numberOfInstallments).toFixed(2),
          expirationDate: new Date(
            launchDate.getFullYear() + Math.trunc((launchDate.getMonth() + i) / 12),
            (launchDate.getMonth() + i) % 12,
            launchDate.getDate())
        })
      )
    }
    if(value % numberOfInstallments)
      this.installments.controls[numberOfInstallments - 1].patchValue({value: lastValue})
    
  }

}
