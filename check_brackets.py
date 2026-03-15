import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    line = 1
    col = 1
    for char in content:
        if char == '\n':
            line += 1
            col = 1
        else:
            col += 1
            
        if char == '{':
            stack.append(('{', line, col))
        elif char == '}':
            if not stack:
                print(f"Boton extra '}}' en linea {line}, col {col}")
                return False
            stack.pop()
            
    if stack:
        for char, l, c in stack:
            print(f"Boton '{char}' no cerrado abierto en linea {l}, col {c}")
        return False
    
    print("Balance de llaves OK")
    return True

if __name__ == "__main__":
    check_balance(sys.argv[1])
