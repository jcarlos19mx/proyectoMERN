export const leccionesIniciales = [
  {
    titulo: 'Arreglos (Arrays)',
    categoria: 'estructura',
    tema: 'Fundamentos',
    descripcion: 'Estructura lineal que almacena elementos en posiciones contiguas de memoria.',
    contenido: `Un arreglo es la estructura más básica. Cada elemento se accede por su índice (empezando en 0).

**Ventajas:** acceso directo O(1), simple de implementar.
**Desventajas:** tamaño fijo (en muchos lenguajes), inserción/eliminación costosa O(n).

**Operaciones comunes:**
- Acceso por índice: O(1)
- Búsqueda lineal: O(n)
- Inserción al final: O(1) amortizado
- Inserción al inicio: O(n)`,
    codigoEjemplo: `// Acceso y recorrido
const numeros = [10, 20, 30, 40];

console.log(numeros[0]);        // 10
console.log(numeros.length);    // 4

// Búsqueda lineal
function buscar(arr, valor) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === valor) return i;
  }
  return -1;
}

console.log(buscar(numeros, 30)); // 2`,
    complejidad: 'Acceso O(1) · Búsqueda O(n)',
    dificultad: 'basico',
    ejercicio: 'Escribe una función que invierta un arreglo sin usar .reverse().',
    orden: 1,
  },
  {
    titulo: 'Listas Enlazadas',
    categoria: 'estructura',
    tema: 'Fundamentos',
    descripcion: 'Nodos conectados por referencias; inserción eficiente al inicio.',
    contenido: `Cada nodo contiene un valor y una referencia al siguiente nodo.

**Tipos:** simple, doble, circular.

**Ventajas:** inserción/eliminación O(1) si tienes la referencia.
**Desventajas:** no hay acceso aleatorio, más uso de memoria.

**Cuándo usarla:** cuando insertas/eliminas frecuentemente al inicio o en medio.`,
    codigoEjemplo: `class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.siguiente = null;
  }
}

class ListaEnlazada {
  constructor() {
    this.cabeza = null;
  }

  insertarInicio(valor) {
    const nuevo = new Nodo(valor);
    nuevo.siguiente = this.cabeza;
    this.cabeza = nuevo;
  }

  recorrer() {
    let actual = this.cabeza;
    while (actual) {
      console.log(actual.valor);
      actual = actual.siguiente;
    }
  }
}

const lista = new ListaEnlazada();
lista.insertarInicio(3);
lista.insertarInicio(2);
lista.insertarInicio(1);
lista.recorrer(); // 1, 2, 3`,
    complejidad: 'Acceso O(n) · Inserción inicio O(1)',
    dificultad: 'basico',
    ejercicio: 'Implementa un método que cuente cuántos nodos tiene la lista.',
    orden: 2,
  },
  {
    titulo: 'Pilas (Stack)',
    categoria: 'estructura',
    tema: 'LIFO',
    descripcion: 'Último en entrar, primero en salir (LIFO).',
    contenido: `La pila solo permite operaciones en el tope: push (apilar) y pop (desapilar).

**Usos reales:**
- Deshacer/rehacer en editores
- Llamadas recursivas (call stack)
- Validar paréntesis balanceados
- Navegación "atrás" en el navegador`,
    codigoEjemplo: `class Pila {
  constructor() {
    this.items = [];
  }

  push(elemento) {
    this.items.push(elemento);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  estaVacia() {
    return this.items.length === 0;
  }
}

const pila = new Pila();
pila.push('A');
pila.push('B');
pila.push('C');
console.log(pila.pop());  // C
console.log(pila.peek()); // B`,
    complejidad: 'Push O(1) · Pop O(1)',
    dificultad: 'basico',
    ejercicio: 'Usa una pila para verificar si una cadena de paréntesis está balanceada: "({[]})".',
    orden: 3,
  },
  {
    titulo: 'Colas (Queue)',
    categoria: 'estructura',
    tema: 'FIFO',
    descripcion: 'Primero en entrar, primero en salir (FIFO).',
    contenido: `Las colas procesan elementos en orden de llegada: enqueue al final, dequeue al frente.

**Usos reales:**
- Colas de impresión
- Buffers de mensajes
- BFS en grafos
- Manejo de tareas en servidores`,
    codigoEjemplo: `class Cola {
  constructor() {
    this.items = [];
  }

  enqueue(elemento) {
    this.items.push(elemento);
  }

  dequeue() {
    return this.items.shift();
  }

  frente() {
    return this.items[0];
  }

  estaVacia() {
    return this.items.length === 0;
  }
}

const cola = new Cola();
cola.enqueue('Ana');
cola.enqueue('Luis');
cola.enqueue('María');
console.log(cola.dequeue()); // Ana
console.log(cola.frente());  // Luis`,
    complejidad: 'Enqueue O(1) · Dequeue O(n)*',
    dificultad: 'basico',
    ejercicio: 'Simula una cola de atención: cada cliente tiene nombre y minutos de espera.',
    orden: 4,
  },
  {
    titulo: 'Árboles Binarios',
    categoria: 'estructura',
    tema: 'Jerarquías',
    descripcion: 'Estructura jerárquica con máximo dos hijos por nodo.',
    contenido: `Un árbol binario tiene un nodo raíz y cada nodo tiene hijo izquierdo e hijo derecho.

**Recorridos:**
- **Inorden** (izq, raíz, der): da orden en BST
- **Preorden** (raíz, izq, der): copiar/clonar árbol
- **Postorden** (izq, der, raíz): eliminar árbol

**BST (Binary Search Tree):** izquierda < raíz < derecha → búsqueda O(log n) en promedio.`,
    codigoEjemplo: `class NodoArbol {
  constructor(valor) {
    this.valor = valor;
    this.izq = null;
    this.der = null;
  }
}

function inorden(nodo, resultado = []) {
  if (!nodo) return resultado;
  inorden(nodo.izq, resultado);
  resultado.push(nodo.valor);
  inorden(nodo.der, resultado);
  return resultado;
}

const raiz = new NodoArbol(10);
raiz.izq = new NodoArbol(5);
raiz.der = new NodoArbol(15);
raiz.izq.izq = new NodoArbol(3);

console.log(inorden(raiz)); // [3, 5, 10, 15]`,
    complejidad: 'Recorrido O(n) · Búsqueda BST O(log n)',
    dificultad: 'intermedio',
    ejercicio: 'Implementa la búsqueda de un valor en un árbol binario de búsqueda.',
    orden: 5,
  },
  {
    titulo: 'Tablas Hash',
    categoria: 'estructura',
    tema: 'Búsqueda rápida',
    descripcion: 'Mapeo clave-valor con acceso promedio O(1).',
    contenido: `Una función hash convierte una clave en un índice del arreglo interno.

**Colisiones:** cuando dos claves caen en el mismo índice.
- **Encadenamiento:** lista en cada bucket
- **Direccionamiento abierto:** buscar siguiente hueco

**Usos:** diccionarios, cachés, bases de datos, conteo de frecuencias.`,
    codigoEjemplo: `class TablaHash {
  constructor(tamano = 10) {
    this.buckets = Array.from({ length: tamano }, () => []);
  }

  _hash(clave) {
    let hash = 0;
    for (const c of clave) hash += c.charCodeAt(0);
    return hash % this.buckets.length;
  }

  set(clave, valor) {
    const idx = this._hash(clave);
    const bucket = this.buckets[idx];
    const existente = bucket.find(([k]) => k === clave);
    if (existente) existente[1] = valor;
    else bucket.push([clave, valor]);
  }

  get(clave) {
    const bucket = this.buckets[this._hash(clave)];
    const par = bucket.find(([k]) => k === clave);
    return par ? par[1] : undefined;
  }
}

const mapa = new TablaHash();
mapa.set('nombre', 'Carlos');
console.log(mapa.get('nombre')); // Carlos`,
    complejidad: 'Promedio O(1) · Peor caso O(n)',
    dificultad: 'intermedio',
    ejercicio: 'Cuenta la frecuencia de cada palabra en un texto usando una tabla hash.',
    orden: 6,
  },
  {
    titulo: 'Búsqueda Lineal',
    categoria: 'algoritmo',
    tema: 'Búsqueda',
    descripcion: 'Recorre elemento por elemento hasta encontrar el objetivo.',
    contenido: `El algoritmo más simple: compara cada elemento con el valor buscado.

**Cuándo usarlo:**
- Arreglos pequeños o desordenados
- No hay estructura que aproveche

**Mejora:** detenerse al encontrar el valor (early exit).`,
    codigoEjemplo: `function busquedaLineal(arr, objetivo) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === objetivo) {
      return { encontrado: true, indice: i };
    }
  }
  return { encontrado: false, indice: -1 };
}

const datos = [4, 2, 7, 1, 9, 3];
console.log(busquedaLineal(datos, 7));
// { encontrado: true, indice: 2 }`,
    complejidad: 'Tiempo O(n) · Espacio O(1)',
    dificultad: 'basico',
    ejercicio: 'Modifica la búsqueda lineal para devolver todos los índices donde aparece el valor.',
    orden: 7,
  },
  {
    titulo: 'Búsqueda Binaria',
    categoria: 'algoritmo',
    tema: 'Búsqueda',
    descripcion: 'Divide el espacio de búsqueda a la mitad en cada paso.',
    contenido: `Requiere un arreglo **ordenado**. Compara el objetivo con el elemento central:
- Si es igual → encontrado
- Si es menor → busca en la mitad izquierda
- Si es mayor → busca en la mitad derecha

Mucho más eficiente que la búsqueda lineal en datos grandes.`,
    codigoEjemplo: `function busquedaBinaria(arr, objetivo) {
  let izq = 0;
  let der = arr.length - 1;

  while (izq <= der) {
    const medio = Math.floor((izq + der) / 2);
    if (arr[medio] === objetivo) return medio;
    if (arr[medio] < objetivo) izq = medio + 1;
    else der = medio - 1;
  }
  return -1;
}

const ordenados = [1, 3, 5, 7, 9, 11, 13];
console.log(busquedaBinaria(ordenados, 7));  // 3
console.log(busquedaBinaria(ordenados, 4));  // -1`,
    complejidad: 'Tiempo O(log n) · Espacio O(1)',
    dificultad: 'basico',
    ejercicio: 'Implementa búsqueda binaria de forma recursiva.',
    orden: 8,
  },
  {
    titulo: 'Bubble Sort',
    categoria: 'algoritmo',
    tema: 'Ordenamiento',
    descripcion: 'Compara pares adyacentes e intercambia si están en orden incorrecto.',
    contenido: `En cada pasada, el mayor "burbujea" hacia el final.

**Ventajas:** fácil de entender e implementar.
**Desventajas:** O(n²) — lento para arreglos grandes.

**Optimización:** si en una pasada no hubo intercambios, el arreglo ya está ordenado.`,
    codigoEjemplo: `function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let intercambio = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        intercambio = true;
      }
    }
    if (!intercambio) break;
  }
  return a;
}

console.log(bubbleSort([64, 34, 25, 12, 22]));
// [12, 22, 25, 34, 64]`,
    complejidad: 'Tiempo O(n²) · Espacio O(1)',
    dificultad: 'basico',
    ejercicio: 'Cuenta cuántas pasadas necesita bubble sort para ordenar un arreglo dado.',
    orden: 9,
  },
  {
    titulo: 'Merge Sort',
    categoria: 'algoritmo',
    tema: 'Ordenamiento',
    descripcion: 'Divide el arreglo, ordena cada mitad y las fusiona.',
    contenido: `Algoritmo **divide y vencerás**:
1. Dividir el arreglo en dos mitades
2. Ordenar recursivamente cada mitad
3. Fusionar (merge) las mitades ordenadas

Estable, predecible y eficiente: O(n log n) siempre.`,
    codigoEjemplo: `function merge(izq, der) {
  const resultado = [];
  let i = 0, j = 0;
  while (i < izq.length && j < der.length) {
    if (izq[i] <= der[j]) resultado.push(izq[i++]);
    else resultado.push(der[j++]);
  }
  return [...resultado, ...izq.slice(i), ...der.slice(j)];
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const medio = Math.floor(arr.length / 2);
  const izq = mergeSort(arr.slice(0, medio));
  const der = mergeSort(arr.slice(medio));
  return merge(izq, der);
}

console.log(mergeSort([38, 27, 43, 3, 9]));
// [3, 9, 27, 38, 43]`,
    complejidad: 'Tiempo O(n log n) · Espacio O(n)',
    dificultad: 'intermedio',
    ejercicio: 'Dibuja el árbol de recursión de merge sort para [8, 3, 5, 1].',
    orden: 10,
  },
  {
    titulo: 'BFS — Búsqueda en Anchura',
    categoria: 'algoritmo',
    tema: 'Grafos',
    descripcion: 'Explora un grafo nivel por nivel usando una cola.',
    contenido: `Breadth-First Search visita todos los nodos a distancia k antes de pasar a k+1.

**Usos:**
- Camino más corto en grafos no ponderados
- Niveles de un árbol
- Redes sociales (amigos de amigos)

**Estructuras:** cola + conjunto de visitados.`,
    codigoEjemplo: `function bfs(grafo, inicio) {
  const visitados = new Set([inicio]);
  const cola = [inicio];
  const orden = [];

  while (cola.length > 0) {
    const nodo = cola.shift();
    orden.push(nodo);
    for (const vecino of grafo[nodo] || []) {
      if (!visitados.has(vecino)) {
        visitados.add(vecino);
        cola.push(vecino);
      }
    }
  }
  return orden;
}

const grafo = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D'],
  D: [],
};

console.log(bfs(grafo, 'A'));
// ['A', 'B', 'C', 'D']`,
    complejidad: 'Tiempo O(V + E) · Espacio O(V)',
    dificultad: 'intermedio',
    ejercicio: 'Encuentra el camino más corto entre dos nodos usando BFS.',
    orden: 11,
  },
  {
    titulo: 'DFS — Búsqueda en Profundidad',
    categoria: 'algoritmo',
    tema: 'Grafos',
    descripcion: 'Explora un grafo yendo lo más profundo posible antes de retroceder.',
    contenido: `Depth-First Search usa recursión o una pila. Explora un camino completo antes de probar otro.

**Usos:**
- Detectar ciclos
- Componentes conexas
- Laberintos
- Orden topológico

**BFS vs DFS:** BFS encuentra el camino más corto; DFS usa menos memoria en árboles profundos.`,
    codigoEjemplo: `function dfs(grafo, nodo, visitados = new Set(), orden = []) {
  if (visitados.has(nodo)) return orden;
  visitados.add(nodo);
  orden.push(nodo);
  for (const vecino of grafo[nodo] || []) {
    dfs(grafo, vecino, visitados, orden);
  }
  return orden;
}

const grafo = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['E'],
  D: [],
  E: [],
};

console.log(dfs(grafo, 'A'));
// ['A', 'B', 'D', 'C', 'E']`,
    complejidad: 'Tiempo O(V + E) · Espacio O(V)',
    dificultad: 'intermedio',
    ejercicio: 'Usa DFS para detectar si un grafo dirigido tiene un ciclo.',
    orden: 12,
  },
];
