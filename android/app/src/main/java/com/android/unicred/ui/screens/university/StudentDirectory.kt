package com.android.unicred.ui.screens.university

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.android.unicred.data.Student
import com.android.unicred.data.StudentStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentDirectory() {
    var searchQuery by remember { mutableStateOf("") }
    
    // Mock student data
    val mockStudents = remember {
        listOf(
            Student(
                id = "1",
                name = "John Doe",
                email = "john.doe@university.edu",
                credentials = emptyList(),
                status = StudentStatus.ACTIVE,
                studentId = "STU001",
                program = "Computer Science",
                enrollmentDate = "2020-09-01",
                gpa = 3.8,
                creditsCompleted = 90,
                totalCredits = 120,
                advisor = "Dr. Smith",
                phone = "+1-555-0123",
                address = "123 University Ave"
            ),
            Student(
                id = "2",
                name = "Jane Smith",
                email = "jane.smith@university.edu",
                credentials = emptyList(),
                status = StudentStatus.ACTIVE,
                studentId = "STU002",
                program = "Data Science",
                enrollmentDate = "2021-01-15",
                gpa = 3.9,
                creditsCompleted = 75,
                totalCredits = 120,
                advisor = "Dr. Johnson",
                phone = "+1-555-0124",
                address = "456 College St"
            ),
            Student(
                id = "3",
                name = "Mike Johnson",
                email = "mike.johnson@university.edu",
                credentials = emptyList(),
                status = StudentStatus.GRADUATED,
                studentId = "STU003",
                program = "Engineering",
                enrollmentDate = "2019-09-01",
                gpa = 3.7,
                creditsCompleted = 120,
                totalCredits = 120,
                advisor = "Dr. Brown",
                phone = "+1-555-0125",
                address = "789 Campus Rd"
            )
        )
    }
    
    val filteredStudents = mockStudents.filter { student ->
        student.name.contains(searchQuery, ignoreCase = true) ||
        student.studentId.contains(searchQuery, ignoreCase = true) ||
        student.program.contains(searchQuery, ignoreCase = true)
    }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = "Student Directory",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        
        item {
            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("Search students...") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search"
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Clear"
                            )
                        }
                    }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline
                )
            )
        }
        
        item {
            // Stats Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatChip(
                    label = "Total",
                    value = mockStudents.size.toString(),
                    modifier = Modifier.weight(1f)
                )
                StatChip(
                    label = "Active",
                    value = mockStudents.count { it.status == StudentStatus.ACTIVE }.toString(),
                    modifier = Modifier.weight(1f)
                )
                StatChip(
                    label = "Graduated",
                    value = mockStudents.count { it.status == StudentStatus.GRADUATED }.toString(),
                    modifier = Modifier.weight(1f)
                )
            }
        }
        
        items(filteredStudents) { student ->
            StudentCard(student = student)
        }
    }
}

@Composable
fun StatChip(
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        shape = RoundedCornerShape(8.dp)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
            )
        }
    }
}

@Composable
fun StudentCard(student: Student) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = student.name,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = student.studentId,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                StatusChip(status = student.status)
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Student Details
            StudentDetailRow(
                icon = Icons.Default.School,
                label = "Program",
                value = student.program
            )
            
            StudentDetailRow(
                icon = Icons.Default.Email,
                label = "Email",
                value = student.email
            )
            
            StudentDetailRow(
                icon = Icons.Default.Person,
                label = "Advisor",
                value = student.advisor
            )
            
            StudentDetailRow(
                icon = Icons.Default.CalendarToday,
                label = "Enrolled",
                value = student.enrollmentDate
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Progress Bar
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Progress",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "${student.creditsCompleted}/${student.totalCredits} credits",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                LinearProgressIndicator(
                    progress = student.creditsCompleted.toFloat() / student.totalCredits.toFloat(),
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.primary
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { /* View credentials */ },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Description,
                        contentDescription = "Credentials",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Credentials")
                }
                
                Button(
                    onClick = { /* Issue credential */ },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Issue",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Issue")
                }
            }
        }
    }
}

@Composable
fun StudentDetailRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            modifier = Modifier.size(20.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = "$label:",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.width(80.dp)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
fun StatusChip(status: StudentStatus) {
    val (backgroundColor, textColor, text) = when (status) {
        StudentStatus.ACTIVE -> Triple(
            MaterialTheme.colorScheme.primaryContainer,
            MaterialTheme.colorScheme.onPrimaryContainer,
            "Active"
        )
        StudentStatus.GRADUATED -> Triple(
            MaterialTheme.colorScheme.secondaryContainer,
            MaterialTheme.colorScheme.onSecondaryContainer,
            "Graduated"
        )
        StudentStatus.INACTIVE -> Triple(
            MaterialTheme.colorScheme.errorContainer,
            MaterialTheme.colorScheme.onErrorContainer,
            "Inactive"
        )
    }
    
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = backgroundColor
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = textColor,
            fontWeight = FontWeight.Medium
        )
    }
}