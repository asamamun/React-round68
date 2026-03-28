const Students = ({allstudents:{batch, tsp,students}, total})=>{ 
    return (
        <div>
            <h1>Batch Name: {batch}</h1>
            <h1>TSP: {tsp}</h1>
            <h2>Total Students: {total}</h2>
            <ul>
                {students.map((student, index) => (
                    <li key={student.id}>ID: {student.id}, Name: {student.name}, Age: {student.age}</li>
                ))}
            </ul>
            
        </div>
    )
}
export default Students
