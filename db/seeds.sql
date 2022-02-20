-- Insert department items --
INSERT INTO department (id, name)
VALUES
    ( 1, "Finance"),
    ( 2, "Quality"),
    ( 3, "Engineering"),
    ( 4, "Manufacturing"),
    ( 5, "Research and Development");

  
    -- Insert role items --
INSERT INTO role (id, title, salary, department_id)
VALUES
    ( 1, "Engrg Manager", 100000, 1),
    ( 2, "Engineer", 70000, 1),
    ( 3, "QC Inspector", 50000, 2),
    ( 4, "Mfg technician", 40000, 4),
    ( 5, "RnD Engineer", 70000, 5),
    ( 6, "QC Manager", 100000, 2);


  -- Insert employee items --
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
     ( 1, "Roy", "Gibson", 1, 0 ),
    ( 2, "Raul", "Genson", 2, 1),
    ( 3, "Razer", "Hammock", 6, 0 ),
    ( 4, "Kenneth", "Sy", 3, 3),
    ( 5, "Kenneth", "Do", 3, 3),
     ( 6, "Kenneth", "Tok", 3, 3),
     ( 7, "Kenneth", "Wok", 3, 3),
     ( 8, "Wei", "Tulow", 2, 1);
