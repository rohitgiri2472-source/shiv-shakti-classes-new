let allStudents = [];

let editingStudentId = null;
let editingStudentSource = null;


// ============================================
// INITIALIZE
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    loadStudents();


    const addButton =
        document.getElementById("addStudentBtn");

    const closeButton =
        document.getElementById("closeStudentModal");

    const cancelButton =
        document.getElementById("cancelStudentBtn");

    const form =
        document.getElementById("studentForm");

    const search =
        document.getElementById("studentSearch");

    const classFilter =
        document.getElementById("studentClassFilter");


    if (addButton) {
        addButton.addEventListener(
            "click",
            openAddStudentModal
        );
    }


    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeStudentModal
        );
    }


    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeStudentModal
        );
    }


    if (form) {
        form.addEventListener(
            "submit",
            saveStudent
        );
    }


    if (search) {
        search.addEventListener(
            "input",
            filterStudents
        );
    }


    if (classFilter) {
        classFilter.addEventListener(
            "change",
            filterStudents
        );
    }

});


// ============================================
// LOAD STUDENTS
// ============================================

async function loadStudents() {

    const tableBody =
        document.getElementById("studentTableBody");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="muted">
                Loading students...
            </td>
        </tr>
    `;


    try {

        const data =
            await apiRequest("/students");


        allStudents =
            data.students || [];


        displayStudents(allStudents);


    } catch (error) {

        console.error(
            "Load students error:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="muted">
                    Unable to load students.
                </td>
            </tr>
        `;

    }

}


// ============================================
// DISPLAY STUDENTS
// ============================================

function displayStudents(students) {

    const tableBody =
        document.getElementById("studentTableBody");


    if (!tableBody) {
        return;
    }


    if (students.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="muted">
                    No students found.
                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML =
        students.map((student, index) => {


            const joinedDate =
                student.createdAt
                    ? new Date(
                        student.createdAt
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "—";


            const sourceText =
                student.source === "registered"
                    ? "Self Registered"
                    : "Admin Added";


            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <div
                            class="student-name-cell"
                        >

                            <div
                                class="student-avatar"
                            >
                                ${escapeHTML(
                                    (student.name || "S")
                                        .charAt(0)
                                        .toUpperCase()
                                )}
                            </div>


                            <strong>
                                ${escapeHTML(
                                    student.name || "—"
                                )}
                            </strong>

                        </div>

                    </td>


                    <td>
                        ${escapeHTML(
                            student.email || "—"
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            student.phone || "—"
                        )}
                    </td>


                    <td>

                        <span
                            class="class-badge"
                        >
                            Class
                            ${escapeHTML(
                                student.className || "—"
                            )}
                        </span>

                    </td>


                    <td>

                        <span
                            class="source-badge ${
                                student.source === "registered"
                                    ? "registered"
                                    : "admin-added"
                            }"
                        >
                            ${sourceText}
                        </span>

                    </td>


                    <td>

                        <div
                            class="student-actions"
                        >

                            <button
                                type="button"
                                class="action-btn edit"
                                onclick="editStudent(
                                    '${student._id}',
                                    '${student.source}'
                                )"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="action-btn delete"
                                onclick="deleteStudent(
                                    '${student._id}',
                                    '${student.source}'
                                )"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("");

}


// ============================================
// SEARCH + FILTER
// ============================================

function filterStudents() {

    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    const classFilter =
        document.getElementById(
            "studentClassFilter"
        );


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedClass =
        classFilter.value;


    const filtered =
        allStudents.filter(student => {


            const matchesSearch =
                !search ||

                (student.name || "")
                    .toLowerCase()
                    .includes(search) ||

                (student.email || "")
                    .toLowerCase()
                    .includes(search) ||

                (student.phone || "")
                    .toLowerCase()
                    .includes(search);


            const matchesClass =
                !selectedClass ||
                student.className === selectedClass;


            return (
                matchesSearch &&
                matchesClass
            );

        });


    displayStudents(filtered);

}


// ============================================
// ADD STUDENT
// ============================================

function openAddStudentModal() {

    editingStudentId = null;

    editingStudentSource = null;


    document
        .getElementById("studentForm")
        .reset();


    document
        .getElementById("studentId")
        .value = "";


    document
        .getElementById("studentSource")
        .value = "";


    document
        .getElementById("studentModalTitle")
        .textContent = "Add Student";


    document
        .getElementById("saveStudentBtn")
        .textContent = "Add Student";


    document
        .getElementById("studentFormMessage")
        .textContent = "";


    document
        .getElementById("studentModal")
        .classList.add("show");

}


// ============================================
// EDIT STUDENT
// ============================================

function editStudent(id, source) {

    const student =
        allStudents.find(
            item =>
                item._id === id &&
                item.source === source
        );


    if (!student) {

        alert("Student not found.");

        return;

    }


    editingStudentId = id;

    editingStudentSource = source;


    document
        .getElementById("studentId")
        .value = id;


    document
        .getElementById("studentSource")
        .value = source;


    document
        .getElementById("studentNameInput")
        .value = student.name || "";


    document
        .getElementById("studentEmailInput")
        .value = student.email || "";


    document
        .getElementById("studentPhoneInput")
        .value = student.phone || "";


    document
        .getElementById("studentClassInput")
        .value = student.className || "";


    document
        .getElementById("studentModalTitle")
        .textContent = "Edit Student";


    document
        .getElementById("saveStudentBtn")
        .textContent = "Update Student";


    document
        .getElementById("studentFormMessage")
        .textContent = "";


    document
        .getElementById("studentModal")
        .classList.add("show");

}


// ============================================
// CLOSE MODAL
// ============================================

function closeStudentModal() {

    document
        .getElementById("studentModal")
        .classList.remove("show");


    editingStudentId = null;

    editingStudentSource = null;

}


// ============================================
// SAVE STUDENT
// ============================================

async function saveStudent(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "studentNameInput"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "studentEmailInput"
            )
            .value
            .trim();


    const phone =
        document
            .getElementById(
                "studentPhoneInput"
            )
            .value
            .trim();


    const className =
        document
            .getElementById(
                "studentClassInput"
            )
            .value;


    const message =
        document.getElementById(
            "studentFormMessage"
        );


    const saveButton =
        document.getElementById(
            "saveStudentBtn"
        );


    message.textContent = "";


    if (!name || !className) {

        message.textContent =
            "Name and class are required.";

        return;

    }


    const studentData = {

        name,

        email,

        phone,

        className

    };


    try {

        saveButton.disabled = true;


        saveButton.textContent =
            editingStudentId
                ? "Updating..."
                : "Adding...";


        let data;


        // =====================================
        // EDIT
        // =====================================

        if (editingStudentId) {


            let endpoint;


            if (
                editingStudentSource ===
                "registered"
            ) {

                endpoint =
                    `/students/registered/${editingStudentId}`;

            } else {

                endpoint =
                    `/students/admin/${editingStudentId}`;

            }


            data = await apiRequest(
                endpoint,
                {
                    method: "PUT",
                    body: JSON.stringify(
                        studentData
                    )
                }
            );


        }

        // =====================================
        // ADD
        // =====================================

        else {

            data = await apiRequest(
                "/students",
                {
                    method: "POST",
                    body: JSON.stringify(
                        studentData
                    )
                }
            );

        }


        message.textContent =
            data.message ||
            "Student saved successfully.";


        await loadStudents();


        setTimeout(() => {

            closeStudentModal();

        }, 700);


    } catch (error) {

        console.error(
            "Save student error:",
            error
        );


        message.textContent =
            error.message ||
            "Unable to save student.";

    } finally {

        saveButton.disabled = false;


        saveButton.textContent =
            editingStudentId
                ? "Update Student"
                : "Add Student";

    }

}


// ============================================
// DELETE STUDENT
// ============================================

async function deleteStudent(
    id,
    source
) {

    const student =
        allStudents.find(
            item =>
                item._id === id &&
                item.source === source
        );


    if (!student) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${student.name}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        let endpoint;


        if (source === "registered") {

            endpoint =
                `/students/registered/${id}`;

        } else {

            endpoint =
                `/students/admin/${id}`;

        }


        await apiRequest(
            endpoint,
            {
                method: "DELETE"
            }
        );


        alert(
            "Student deleted successfully."
        );


        await loadStudents();


    } catch (error) {

        console.error(
            "Delete student error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete student."
        );

    }

}


// ============================================
// SECURITY
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}