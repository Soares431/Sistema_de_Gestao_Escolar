package br.com.mildevs.sistema_escolar_api.controller;

import br.com.mildevs.sistema_escolar_api.DTO.SalaDTO.SalaResponseDTO;
import br.com.mildevs.sistema_escolar_api.DTO.SalaDTO.SalaRequestDTO;
import br.com.mildevs.sistema_escolar_api.DTO.Turma.TurmaResumoDTO;
import br.com.mildevs.sistema_escolar_api.entity.Sala
        ;
import br.com.mildevs.sistema_escolar_api.entity.Turma;
import br.com.mildevs.sistema_escolar_api.repository.SalaRepository;
import br.com.mildevs.sistema_escolar_api.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/salas")
public class SalaController {

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    private SalaResponseDTO toResponseDTO(Sala sala) {
        TurmaResumoDTO turmaDTO = null;
        if (sala.getTurma() != null) {
            turmaDTO = new TurmaResumoDTO(sala.getTurma().getCodTurma(), sala.getTurma().getNome());
        }
        return new SalaResponseDTO(
                sala.getNroSala(),
                sala.getLargura(),
                sala.getComprimento(),
                sala.getAltura(),
                turmaDTO
        );
    }

    @PostMapping
    public ResponseEntity<SalaResponseDTO> criar(@RequestBody SalaRequestDTO dto) {
        Sala sala = new Sala();
        sala.setLargura(dto.getLargura());
        sala.setComprimento(dto.getComprimento());
        sala.setAltura(dto.getAltura());

        if (dto.getCodTurma() != null) {
            Turma turma = turmaRepository.findById(dto.getCodTurma()).orElse(null);
            if (turma == null) {
                return ResponseEntity.badRequest().build();
            }

            sala.setTurma(turma);
        }

        Sala salva = salaRepository.save(sala);
        return ResponseEntity.ok(toResponseDTO(salva));
    }

    @GetMapping
    public List<SalaResponseDTO> listarTodos() {
        return salaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{nroSala}")
    public ResponseEntity<SalaResponseDTO> buscarPorId(@PathVariable Integer nroSala) {
        return salaRepository.findById(nroSala)
                .map(this::toResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{nroSala}")
    public ResponseEntity<SalaResponseDTO> atualizar(@PathVariable Integer nroSala, @RequestBody SalaRequestDTO dto) {
        return salaRepository.findById(nroSala)
                .map(sala -> {
                    sala.setAltura(dto.getAltura());
                    sala.setComprimento(dto.getComprimento());
                    sala.setLargura(dto.getLargura());
                    Sala atualizada = salaRepository.save(sala);
                    return ResponseEntity.ok(toResponseDTO(atualizada));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{nroSalaSala}/turmas/{codTurma}")
    public ResponseEntity<SalaResponseDTO> vincularTurma(@PathVariable Integer nroSalaSala, @PathVariable Integer codTurma) {
        Sala sala = salaRepository.findById(nroSalaSala).orElse(null);
        Turma turma = turmaRepository.findById(codTurma).orElse(null);

        if (sala == null || turma == null)
            return ResponseEntity.notFound().build();

        sala.setTurma(turma);
        Sala atualizado = salaRepository.save(sala);
        return ResponseEntity.ok(toResponseDTO(atualizado));
    }

    @DeleteMapping("/{nroSala}")
    public ResponseEntity<Void> deletar(@PathVariable Integer nroSala) {
        Sala sala = salaRepository.findById(nroSala).orElse(null);
        if (sala == null)
            return ResponseEntity.notFound().build();

        if (sala.getTurma() != null)
            sala.setTurma(null);

        salaRepository.deleteById(nroSala);
        return ResponseEntity.noContent().build();

    }

    @DeleteMapping("/{nroSala}/turmas")
    public ResponseEntity<SalaResponseDTO> desvincularTurma(@PathVariable Integer nroSala) {
        Sala sala = salaRepository.findById(nroSala).orElse(null);
        if (sala == null)
            return ResponseEntity.notFound().build();

        sala.setTurma(null);
        Sala atualizado = salaRepository.save(sala);
        return ResponseEntity.ok(toResponseDTO(atualizado));

    }

}
