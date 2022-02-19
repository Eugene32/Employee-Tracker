-- Insert department items --
INSERT INTO department (id, name)
VALUES
    ( 1, "Finance"),
    ( 2, "Quality"),
    ( 3, "Engineering"),
    ( 4, "Manufacturing"),
    ( 5, "Research and Development");

    -- Insert department items --
INSERT INTO role (id, title, salary, department_id)
VALUES
    ( 1, "Engrg Manager", 100,000.00, 3),
    ( 2, "Engineer", 70,000.50, 3),
    ( 3, "QC Inspector", 50,000.36, 2),
    ( 4, "Mfg technician", 40,000.56, 4),
    ( 5, "RnD Engineer", 70,000.56, 5),
    ( 6, "QC Manager", 100,000.79, 2);