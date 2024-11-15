// Row 2: Deduction Choice
const beginDeduction_Button = document.getElementById("begin-deduction_Button");
const changeDeduction_Button = document.getElementById("change-deduction_Button");
const stopDeduction_Button = document.getElementById("stop-deduction_Button");

// Row 3: Effective Date
const effectiveDate_Field = document.getElementById("effective-date_Field");

// Row 5-7: Employee Information (Section 1)
const name_Field = document.getElementById("name_Field");
const phone_Field = document.getElementById("phone_Field");
const address_Field = document.getElementById("address_Field");
const dob_Field = document.getElementById("dob_Field");
const email_Field = document.getElementById("email_Field");
const age_Field = document.getElementById("age_Field");
const employeeId_Field = document.getElementById("employee-id_Field");

// Row 16: HSA Contributions (Section 2)
const annualContribution_Field1 = document.getElementById("annual-contribution_Field1");

// Row 19: Employee Signature (Section 4)
const signature_Field = document.getElementById("signature_Field");
const signatureDate_Field = document.getElementById("signature-date_Field");

// Row 21: Benefits Office Use
const annualContribution_Field2 = document.getElementById("annual-contribution_Field2");
const remainingPaychecks_Field = document.getElementById("remaining-paychecks_Field");
const perPaycheckContribution_Field = document.getElementById("per-paycheck-contribution_Field");


// on dom content loaded, prefill fields and attach event listeners
document.addEventListener("DOMContentLoaded", function () {
    prefillSignatureDate(); // prefill signature date when the page loads
    prefillRemainingPaychecks(); // prefill remaining paychecks when the page loads

    // attach blur event listeners
    dob_Field.addEventListener("blur", validateAgeOnBlur); // validate age on blur
    annualContribution_Field1.addEventListener("blur", calculatePerPaycheckContribution); // calculate per paycheck on annual contribution blur
});

// prefill today's date in the signature date field
function prefillSignatureDate() {
    const today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // pad month with leading zero
    let day = String(today.getDate()).padStart(2, '0'); // pad day with leading zero

    const formattedDate = ${year}-${month}-${day};
    signatureDate_Field.value = formattedDate;
}

function prefillRemainingPaychecks() {
    const today = new Date();

    const currentMonth = today.getMonth(); // store the current month in a variable

    const monthsRemaining = 11 - currentMonth; // months left in the year

    // calculate remaining paychecks in future months
    let remainingPaychecks = monthsRemaining * 2;

    // add remaining paychecks for the current month
    if (today.getDate() > 14) {
        remainingPaychecks = remainingPaychecks + 1; // only one paycheck remains this month
    } 
    else {
        remainingPaychecks = remainingPaychecks + 2; // both paychecks remain this month
    }

    // set the remaining paychecks field
    remainingPaychecks_Field.value = remainingPaychecks;
}

// validate date of birth and prefill age on blur
function validateAgeOnBlur() {
    const dob_DateObject = new Date(dob_Field.value);
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18); // minimum age 18 validation

    if (dob_DateObject > today) {
        alert("you must be 18 years or older.");
        dob_Field.value = "";
        age_Field.value = ""; 
        return;
    }

    const age = calculateAge(dob_DateObject);
    if (age >= 18 && age <= 120) {
        age_Field.value = age;
    } 
    else {
        alert("age must be between 18 and 120.");
        age_Field.value = ""; // clear the age field if invalid
    }
}

// helper function to calculate age based on date of birth
function calculateAge(dob_DateObject) {
    const today = new Date();
    let age = today.getFullYear() - dob_DateObject.getFullYear();

    if (today.getMonth() < dob_DateObject.getMonth() || (today.getMonth() === dob_DateObject.getMonth() && today.getDate() < dob_DateObject.getDate())) {
        age--;
    }

    return age;
}

// validate annual contribution on blur and trigger per paycheck calculation
annualContribution_Field1.addEventListener("blur", function () {
    const annualContribution = parseFloat(annualContribution_Field1.value);

    if (annualContribution < 1 || annualContribution > 8550) {
        alert("annual contribution must be between 1 and 8550.");
        annualContribution_Field1.value = ""; 
    } 
    else {
        calculatePerPaycheckContribution(); 
    }
});

// calculate per-paycheck contribution based on the annual contribution and remaining paychecks
function calculatePerPaycheckContribution() {
    
    const annualContribution = parseFloat(annualContribution_Field1.value);
    const remainingPaychecks = parseInt(remainingPaychecks_Field.value);

    if (isNaN(annualContribution) || isNaN(remainingPaychecks) || remainingPaychecks === 0) {
        alert("invalid input for annual contribution or remaining paychecks.");
        perPaycheckContribution_Field.value = ""; // clear the per-paycheck contribution if invalid
        return;
    }

    const perPaycheckContribution = (annualContribution / remainingPaychecks).toFixed(2);
    perPaycheckContribution_Field.value = perPaycheckContribution; // update the per-paycheck contribution field
}