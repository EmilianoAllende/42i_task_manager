export const translations = {
  en: {
    // General
    cancel: "Cancel",
    save: "Save Changes",
    saving: "Saving...",
    delete: "Delete",
    deleting: "Deleting...",
    edit: "Edit",
    logout: "Log out",
    
    // Sidebar
    home: "Home",
    profile: "Profile",
    theme: "Theme",
    language: "Language",

    // Auth
    login: "Sign In",
    register: "Create Account",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    email: "Email address",
    password: "Password",
    name: "Full Name",
    welcome_back: "Welcome back",
    create_account: "Create your account",
    login_success: "Login successful!",
    register_success: "Account created successfully!",
    login_failed: "Login failed",
    register_failed: "Registration failed",

    // Board
    board_title: "My Tasks",
    add_task: "Add Task",
    logout_success: "Logged out successfully",
    failed_load: "Failed to load tasks",
    network_error: "Network error",
    
    // Task columns
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",

    // Task Detail
    task_title_label: "Task Title",
    task_title_placeholder: "What needs to be done?",
    status: "Status",
    priority: "Priority",
    effort_label: "Direct Effort Estimate",
    description: "Description",
    description_placeholder: "Add more details...",
    subtasks: "Subtasks",
    add_subtask: "Add Subtask",
    no_subtasks: "No subtasks yet.",
    edit_task: "Edit Task",
    new_task: "New Task",

    // Aggregations
    aggregated: "Aggregated Estimations",
    total_effort: "Total Effort",
    completed: "Completed (Done)",
    remaining: "Remaining",

    // Delete Confirm
    confirm_title: "Delete Task",
    confirm_msg: "Are you sure you want to delete this task? All subtasks will be removed as well.",
    confirm_yes: "Yes, delete",

    // Profile
    profile_title: "My Profile",
    update_profile: "Update Profile",
    update_success: "Profile updated successfully!",
    
    // Priorities
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent"
  },
  es: {
    // General
    cancel: "Cancelar",
    save: "Guardar Cambios",
    saving: "Guardando...",
    delete: "Eliminar",
    deleting: "Eliminando...",
    edit: "Editar",
    logout: "Cerrar sesión",
    
    // Sidebar
    home: "Inicio",
    profile: "Perfil",
    theme: "Tema",
    language: "Idioma",

    // Auth
    login: "Iniciar Sesión",
    register: "Crear Cuenta",
    no_account: "¿No tienes una cuenta?",
    have_account: "¿Ya tienes una cuenta?",
    email: "Correo electrónico",
    password: "Contraseña",
    name: "Nombre completo",
    welcome_back: "Reingreso a Taskit",
    create_account: "Crea tu cuenta",
    login_success: "¡Inicio de sesión exitoso!",
    register_success: "¡Cuenta creada con éxito!",
    login_failed: "Fallo al iniciar sesión",
    register_failed: "Error en el registro",

    // Board
    board_title: "Mis Tareas",
    add_task: "Añadir Tarea",
    logout_success: "Sesión cerrada correctamente",
    failed_load: "No se pudieron cargar las tareas",
    network_error: "Error de red",
    
    // Task columns
    TODO: "Por Hacer",
    IN_PROGRESS: "En Progreso",
    DONE: "Terminado",

    // Task Detail
    task_title_label: "Título de la Tarea",
    task_title_placeholder: "¿Qué necesitas hacer?",
    status: "Estado",
    priority: "Prioridad",
    effort_label: "Estimación de Esfuerzo",
    description: "Descripción",
    description_placeholder: "Añade más detalles...",
    subtasks: "Subtareas",
    add_subtask: "Añadir Subtarea",
    no_subtasks: "Aún no hay subtareas.",
    edit_task: "Editar Tarea",
    new_task: "Nueva Tarea",

    // Aggregations
    aggregated: "Estimaciones Agregadas",
    total_effort: "Esfuerzo Total",
    completed: "Completado",
    remaining: "Restante",

    // Delete Confirm
    confirm_title: "Eliminar Tarea",
    confirm_msg: "¿Estás seguro de que deseas eliminar esta tarea? Las subtareas internas también podrían borrarse.",
    confirm_yes: "Sí, eliminar",

    // Profile
    profile_title: "Mi Perfil",
    update_profile: "Actualizar Perfil",
    update_success: "¡Perfil actualizado con éxito!",
    
    // Priorities
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    URGENT: "Urgente"
  }
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;
