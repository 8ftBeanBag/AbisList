export function generateCentralCourses(courseNames){
    return courseNames.map((c)=>{
        return c.toLowerCase().replace(/[^a-z]&^\s/g, '').replace(/\s+/g, "-")
    })
}