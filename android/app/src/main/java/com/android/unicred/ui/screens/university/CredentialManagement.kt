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
import com.android.unicred.data.Credential
import com.android.unicred.data.CredentialStatus
import com.android.unicred.data.CredentialType

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CredentialManagement() {
    var searchQuery by remember { mutableStateOf("") }
    var showCreateDialog by remember { mutableStateOf(false) }
    
    // Mock credential data
    val mockCredentials = remember {
        listOf(
            Credential(
                id = "1",
                title = "Bachelor of Computer Science",
                type = CredentialType.BACHELOR,
                institution = "University of Technology",
                dateIssued = "2023-06-15",
                status = CredentialStatus.VERIFIED,
                studentId = "STU001",
                studentName = "John Doe",
                blockchainHash = "0x1234567890abcdef"
            ),
            Credential(
                id = "2",
                title = "Master of Data Science",
                type = CredentialType.MASTER,
                institution = "University of Technology",
                dateIssued = "2023-08-20",
                status = CredentialStatus.PENDING,
                studentId = "STU002",
                studentName = "Jane Smith"
            ),
            Credential(
                id = "3",
                title = "Machine Learning Certificate",
                type = CredentialType.CERTIFICATE,
                institution = "University of Technology",
                dateIssued = "2023-05-10",
                status = CredentialStatus.VERIFIED,
                studentId = "STU003",
                studentName = "Mike Johnson",
                blockchainHash = "0xabcdef1234567890"
            )
        )
    }
    
    val filteredCredentials = mockCredentials.filter { credential ->
        credential.title.contains(searchQuery, ignoreCase = true) ||
        credential.studentName?.contains(searchQuery, ignoreCase = true) == true ||
        credential.studentId?.contains(searchQuery, ignoreCase = true) == true
    }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Credential Management",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                FloatingActionButton(
                    onClick = { showCreateDialog = true },
                    modifier = Modifier.size(48.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Create Credential"
                    )
                }
            }
        }
        
        item {
            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("Search credentials...") },
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
                    value = mockCredentials.size.toString(),
                    modifier = Modifier.weight(1f)
                )
                StatChip(
                    label = "Verified",
                    value = mockCredentials.count { it.status == CredentialStatus.VERIFIED }.toString(),
                    modifier = Modifier.weight(1f)
                )
                StatChip(
                    label = "Pending",
                    value = mockCredentials.count { it.status == CredentialStatus.PENDING }.toString(),
                    modifier = Modifier.weight(1f)
                )
            }
        }
        
        items(filteredCredentials) { credential ->
            CredentialManagementCard(credential = credential)
        }
    }
    
    // Create Credential Dialog
    if (showCreateDialog) {
        CreateCredentialDialog(
            onDismiss = { showCreateDialog = false },
            onCreate = { /* Handle credential creation */ }
        )
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
fun CredentialManagementCard(credential: Credential) {
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
                        text = credential.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = credential.studentName ?: "Unknown Student",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                StatusChip(status = credential.status)
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Credential Details
            CredentialDetailRow(
                icon = Icons.Default.School,
                label = "Type",
                value = credential.type.name.lowercase().replaceFirstChar { it.uppercase() }
            )
            
            CredentialDetailRow(
                icon = Icons.Default.Person,
                label = "Student ID",
                value = credential.studentId ?: "N/A"
            )
            
            CredentialDetailRow(
                icon = Icons.Default.CalendarToday,
                label = "Date Issued",
                value = credential.dateIssued
            )
            
            if (credential.blockchainHash != null) {
                CredentialDetailRow(
                    icon = Icons.Default.Security,
                    label = "Blockchain Hash",
                    value = credential.blockchainHash.take(20) + "...",
                    isClickable = true
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { /* View details */ },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Visibility,
                        contentDescription = "View",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("View")
                }
                
                if (credential.status == CredentialStatus.PENDING) {
                    Button(
                        onClick = { /* Approve credential */ },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "Approve",
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Approve")
                    }
                } else {
                    OutlinedButton(
                        onClick = { /* Revoke credential */ },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = MaterialTheme.colorScheme.error
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Block,
                            contentDescription = "Revoke",
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Revoke")
                    }
                }
            }
        }
    }
}

@Composable
fun CredentialDetailRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    isClickable: Boolean = false
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
            modifier = Modifier.width(100.dp)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = if (isClickable) {
                MaterialTheme.colorScheme.primary
            } else {
                MaterialTheme.colorScheme.onSurface
            }
        )
    }
}

@Composable
fun StatusChip(status: CredentialStatus) {
    val (backgroundColor, textColor, text) = when (status) {
        CredentialStatus.VERIFIED -> Triple(
            MaterialTheme.colorScheme.primaryContainer,
            MaterialTheme.colorScheme.onPrimaryContainer,
            "Verified"
        )
        CredentialStatus.PENDING -> Triple(
            MaterialTheme.colorScheme.secondaryContainer,
            MaterialTheme.colorScheme.onSecondaryContainer,
            "Pending"
        )
        CredentialStatus.EXPIRED -> Triple(
            MaterialTheme.colorScheme.errorContainer,
            MaterialTheme.colorScheme.onErrorContainer,
            "Expired"
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

@Composable
fun CreateCredentialDialog(
    onDismiss: () -> Unit,
    onCreate: (String, String, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var studentId by remember { mutableStateOf("") }
    var studentName by remember { mutableStateOf("") }
    var graduationDate by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Create New Credential",
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Credential Title") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                OutlinedTextField(
                    value = studentId,
                    onValueChange = { studentId = it },
                    label = { Text("Student ID") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                OutlinedTextField(
                    value = studentName,
                    onValueChange = { studentName = it },
                    label = { Text("Student Name") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                OutlinedTextField(
                    value = graduationDate,
                    onValueChange = { graduationDate = it },
                    label = { Text("Graduation Date (YYYY-MM-DD)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    if (title.isNotBlank() && studentId.isNotBlank() && 
                        studentName.isNotBlank() && graduationDate.isNotBlank()) {
                        onCreate(title, studentId, studentName, graduationDate)
                        onDismiss()
                    }
                }
            ) {
                Text("Create")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}